package com.example.demo.controller;

import com.example.demo.service.DatabaseManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/db")
public class DatabaseManagementController {

    @Autowired
    private DatabaseManagementService dbService;

    /**
     * Get all tables in the database
     */
    @GetMapping("/tables")
    public ResponseEntity<Map<String, Object>> getAllTables() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> tables = dbService.getTables();
            response.put("success", true);
            response.put("tables", tables);
            response.put("count", tables.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get table structure
     */
    @GetMapping("/tables/{tableName}/structure")
    public ResponseEntity<Map<String, Object>> getTableStructure(@PathVariable String tableName) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!dbService.tableExists(tableName)) {
                response.put("success", false);
                response.put("message", "Table '" + tableName + "' does not exist");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            List<Map<String, Object>> columns = dbService.getTableStructure(tableName);
            response.put("success", true);
            response.put("tableName", tableName);
            response.put("columns", columns);
            response.put("columnCount", columns.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get row count for a table
     */
    @GetMapping("/tables/{tableName}/count")
    public ResponseEntity<Map<String, Object>> getTableRowCount(@PathVariable String tableName) {
        Map<String, Object> result = dbService.getTableRowCount(tableName);
        if (!(Boolean) result.getOrDefault("exists", false)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Drop a table
     */
    @DeleteMapping("/tables/{tableName}")
    public ResponseEntity<Map<String, Object>> dropTable(@PathVariable String tableName) {
        Map<String, Object> result = dbService.dropTable(tableName);
        if (!(Boolean) result.getOrDefault("success", false)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Execute a SELECT query
     */
    @PostMapping("/query")
    public ResponseEntity<Map<String, Object>> executeQuery(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String sql = request.get("sql");
        
        if (sql == null || sql.trim().isEmpty()) {
            response.put("success", false);
            response.put("error", "SQL query is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        // Only allow SELECT queries in this endpoint
        if (!sql.trim().toUpperCase().startsWith("SELECT")) {
            response.put("success", false);
            response.put("error", "Only SELECT queries are allowed in this endpoint");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        try {
            List<Map<String, Object>> results = dbService.executeQuery(sql);
            response.put("success", true);
            response.put("data", results);
            response.put("rowCount", results.size());
            response.put("sql", sql);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("sql", sql);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Execute DDL statement (CREATE, ALTER, DROP)
     */
    @PostMapping("/ddl")
    public ResponseEntity<Map<String, Object>> executeDDL(@RequestBody Map<String, String> request) {
        String sql = request.get("sql");
        
        if (sql == null || sql.trim().isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "SQL statement is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        Map<String, Object> result = dbService.executeDDL(sql);
        if (!(Boolean) result.getOrDefault("success", false)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Execute DML statement (INSERT, UPDATE, DELETE)
     */
    @PostMapping("/dml")
    public ResponseEntity<Map<String, Object>> executeDML(@RequestBody Map<String, String> request) {
        String sql = request.get("sql");
        
        if (sql == null || sql.trim().isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "SQL statement is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        Map<String, Object> result = dbService.executeDML(sql);
        if (!(Boolean) result.getOrDefault("success", false)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Execute multiple SQL statements in a batch
     */
    @PostMapping("/batch")
    public ResponseEntity<Map<String, Object>> executeBatch(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<String> statements = (List<String>) request.get("statements");
        
        if (statements == null || statements.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "At least one SQL statement is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        Map<String, Object> result = dbService.executeBatch(statements);
        if (!(Boolean) result.getOrDefault("success", false)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> tables = dbService.getTables();
            response.put("status", "healthy");
            response.put("tableCount", tables.size());
            response.put("message", "Database connection is working");
            
            // Check for the problematic 'users' table
            boolean usersTableExists = dbService.tableExists("users");
            response.put("usersTableExists", usersTableExists);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "unhealthy");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }
}