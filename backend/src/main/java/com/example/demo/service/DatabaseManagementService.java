package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class DatabaseManagementService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Execute a SELECT query and return results
     */
    public List<Map<String, Object>> executeQuery(String sql) {
        try {
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            throw new RuntimeException("Query execution failed: " + e.getMessage(), e);
        }
    }

    /**
     * Execute a DDL statement (CREATE, ALTER, DROP)
     */
    @Transactional
    public Map<String, Object> executeDDL(String sql) {
        Map<String, Object> result = new HashMap<>();
        try {
            jdbcTemplate.execute(sql);
            result.put("success", true);
            result.put("message", "DDL statement executed successfully");
            result.put("sql", sql);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            result.put("sql", sql);
        }
        return result;
    }

    /**
     * Execute a DML statement (INSERT, UPDATE, DELETE)
     */
    @Transactional
    public Map<String, Object> executeDML(String sql) {
        Map<String, Object> result = new HashMap<>();
        try {
            int rowsAffected = jdbcTemplate.update(sql);
            result.put("success", true);
            result.put("rowsAffected", rowsAffected);
            result.put("message", rowsAffected + " row(s) affected");
            result.put("sql", sql);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            result.put("sql", sql);
        }
        return result;
    }

    /**
     * Get all tables in the database
     */
    public List<Map<String, Object>> getTables() {
        String sql = """
            SELECT 
                table_name,
                table_type
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """;
        return executeQuery(sql);
    }

    /**
     * Get table structure
     */
    public List<Map<String, Object>> getTableStructure(String tableName) {
        String sql = """
            SELECT 
                column_name,
                data_type,
                character_maximum_length,
                is_nullable,
                column_default
            FROM information_schema.columns
            WHERE table_schema = 'public' 
                AND table_name = ?
            ORDER BY ordinal_position
        """;
        return jdbcTemplate.queryForList(sql, tableName.toLowerCase());
    }

    /**
     * Check if a table exists
     */
    public boolean tableExists(String tableName) {
        String sql = """
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
                AND table_name = ?
        """;
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, tableName.toLowerCase());
        return count != null && count > 0;
    }

    /**
     * Drop a table if it exists
     */
    @Transactional
    public Map<String, Object> dropTable(String tableName) {
        Map<String, Object> result = new HashMap<>();
        
        if (!tableExists(tableName)) {
            result.put("success", false);
            result.put("message", "Table '" + tableName + "' does not exist");
            return result;
        }
        
        try {
            String sql = "DROP TABLE IF EXISTS " + tableName + " CASCADE";
            jdbcTemplate.execute(sql);
            result.put("success", true);
            result.put("message", "Table '" + tableName + "' dropped successfully");
            result.put("sql", sql);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        
        return result;
    }

    /**
     * Get row count for a table
     */
    public Map<String, Object> getTableRowCount(String tableName) {
        Map<String, Object> result = new HashMap<>();
        
        if (!tableExists(tableName)) {
            result.put("exists", false);
            result.put("message", "Table '" + tableName + "' does not exist");
            return result;
        }
        
        try {
            String sql = "SELECT COUNT(*) FROM " + tableName;
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
            result.put("exists", true);
            result.put("tableName", tableName);
            result.put("rowCount", count);
        } catch (Exception e) {
            result.put("exists", true);
            result.put("error", e.getMessage());
        }
        
        return result;
    }

    /**
     * Execute multiple SQL statements in a transaction
     */
    @Transactional
    public Map<String, Object> executeBatch(List<String> sqlStatements) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> results = new ArrayList<>();
        
        try {
            for (String sql : sqlStatements) {
                Map<String, Object> statementResult = new HashMap<>();
                statementResult.put("sql", sql);
                
                try {
                    if (sql.trim().toUpperCase().startsWith("SELECT")) {
                        List<Map<String, Object>> queryResult = jdbcTemplate.queryForList(sql);
                        statementResult.put("success", true);
                        statementResult.put("rows", queryResult.size());
                        statementResult.put("data", queryResult);
                    } else {
                        jdbcTemplate.execute(sql);
                        statementResult.put("success", true);
                        statementResult.put("message", "Executed successfully");
                    }
                } catch (Exception e) {
                    statementResult.put("success", false);
                    statementResult.put("error", e.getMessage());
                    throw e; // Rollback transaction
                }
                
                results.add(statementResult);
            }
            
            result.put("success", true);
            result.put("totalStatements", sqlStatements.size());
            result.put("results", results);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            result.put("results", results);
        }
        
        return result;
    }
}