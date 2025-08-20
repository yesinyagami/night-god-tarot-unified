/**
 * Consent Tracking Routes
 * Handles user consent data collection compliance
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// In-memory consent storage (replace with database in production)
const consentRecords = new Map();

// Track consent decision
router.post('/track', asyncHandler(async (req, res) => {
  const { consent, timestamp, userAgent } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Create consent record
  const consentRecord = {
    id: `consent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    consent: Boolean(consent),
    timestamp: timestamp || new Date().toISOString(),
    userAgent: userAgent || req.get('User-Agent'),
    clientIP: clientIP,
    recorded: new Date().toISOString()
  };
  
  // Store the record (in production, save to database)
  consentRecords.set(consentRecord.id, consentRecord);
  
  // Log for compliance audit trail
  console.log('📋 Consent recorded:', {
    id: consentRecord.id,
    consent: consent ? 'GRANTED' : 'DENIED',
    timestamp: consentRecord.timestamp,
    ip: clientIP.replace(/:\d+$/, '') // Remove port for privacy
  });
  
  res.json({
    success: true,
    message: 'Consent recorded successfully',
    recordId: consentRecord.id
  });
}));

// Get consent statistics (admin only)
router.get('/stats', asyncHandler(async (req, res) => {
  // In production, add proper admin authentication
  const records = Array.from(consentRecords.values());
  
  const stats = {
    totalRecords: records.length,
    consentGranted: records.filter(r => r.consent).length,
    consentDenied: records.filter(r => r.consent === false).length,
    todayRecords: records.filter(r => {
      const recordDate = new Date(r.recorded).toDateString();
      const today = new Date().toDateString();
      return recordDate === today;
    }).length,
    recentRecords: records
      .sort((a, b) => new Date(b.recorded).getTime() - new Date(a.recorded).getTime())
      .slice(0, 10)
      .map(record => ({
        id: record.id,
        consent: record.consent,
        timestamp: record.timestamp,
        recorded: record.recorded
      }))
  };
  
  res.json({
    success: true,
    stats,
    lastUpdated: new Date().toISOString()
  });
}));

// Health check for consent system
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'consent-tracking',
    recordsCount: consentRecords.size,
    timestamp: new Date().toISOString()
  });
});

// Export consent records (admin only, for compliance)
router.get('/export', asyncHandler(async (req, res) => {
  // In production, add proper admin authentication and rate limiting
  const records = Array.from(consentRecords.values());
  
  // Create CSV format for compliance export
  const csvHeaders = 'ID,Consent,User Timestamp,Recorded Timestamp,User Agent,Client IP\n';
  const csvData = records.map(record => 
    `"${record.id}","${record.consent}","${record.timestamp}","${record.recorded}","${record.userAgent.replace(/"/g, '""')}","${record.clientIP}"`
  ).join('\n');
  
  const csv = csvHeaders + csvData;
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="consent-records-${new Date().toISOString().split('T')[0]}.csv"`);
  res.send(csv);
}));

export default router;