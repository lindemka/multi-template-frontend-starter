'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TestRegistrationPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const testRegistration = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    const timestamp = Date.now();
    const testData = {
      username: `testuser_${timestamp}`,
      email: `test_${timestamp}@example.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: `User_${timestamp}`
    };
    
    try {
      console.log('Sending registration request with data:', testData);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      
      const data = await response.json();
      console.log('Registration response:', data);
      
      if (response.ok) {
        setResult({
          success: true,
          data: data,
          testData: testData
        });
        
        // Test if user was created in database
        const dbCheckResponse = await fetch('/api/db/status');
        const dbStatus = await dbCheckResponse.json();
        
        setResult(prev => ({
          ...prev,
          dbCounts: dbStatus.counts
        }));
      } else {
        setError(data.error || 'Registration failed');
        setResult({
          success: false,
          error: data.error,
          status: response.status
        });
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Network error');
      setResult({
        success: false,
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Test Registration Flow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Click the button below to test the registration flow with auto-generated test data.
          </p>
          
          <Button 
            onClick={testRegistration} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing Registration...' : 'Test Registration'}
          </Button>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {result && (
            <div className="space-y-4">
              <Alert variant={result.success ? "default" : "destructive"}>
                <AlertDescription>
                  {result.success ? '✅ Registration Successful!' : '❌ Registration Failed'}
                </AlertDescription>
              </Alert>
              
              {result.success && (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Test Data Sent:</h3>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(result.testData, null, 2)}
                    </pre>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Response Received:</h3>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify({
                        id: result.data.id,
                        username: result.data.username,
                        email: result.data.email,
                        role: result.data.role,
                        firstName: result.data.firstName,
                        lastName: result.data.lastName,
                        token: result.data.token ? 'JWT Token (hidden)' : undefined
                      }, null, 2)}
                    </pre>
                  </div>
                  
                  {result.dbCounts && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Database Counts:</h3>
                      <pre className="text-xs">
                        {JSON.stringify(result.dbCounts, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              )}
              
              {!result.success && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Error Details:</h3>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p>This page tests:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Frontend to backend API connection</li>
              <li>User creation in database</li>
              <li>Profile creation for new user</li>
              <li>JWT token generation</li>
              <li>Database count verification</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}