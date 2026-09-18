const Invoice = require('../models/Invoice');
const ProcessingJob = require('../models/ProcessingJob');

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
// @access  Private
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get basic invoice counts
    const [totalInvoices, processedInvoices, pendingReview, totalAmount] = await Promise.all([
      Invoice.countDocuments({ user_id: userId }),
      Invoice.countDocuments({
        user_id: userId,
        status: { $in: ['extracted', 'validated', 'reviewed', 'approved', 'exported'] }
      }),
      Invoice.countDocuments({
        user_id: userId,
        status: 'extracted' // Pending review: extracted but not yet validated
      }),
      Invoice.aggregate([
        { $match: { user_id: userId } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } }
      ])
    ]);

    // Get processing rate: percentage of invoices that are auto-processed (validated, approved, exported)
    const autoProcessedCount = await Invoice.countDocuments({
      user_id: userId,
      status: { $in: ['validated', 'approved', 'exported'] }
    });

    const processingRate = totalInvoices > 0
      ? (autoProcessedCount / totalInvoices) * 100
      : 0;

    // Get average processing time from completed processing jobs
    const avgProcessingTimeResult = await ProcessingJob.aggregate([
      {
        $match: {
          user_id: userId,
          status: 'completed',
          processing_time_ms: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$processing_time_ms' }
        }
      }
    ]);

    const avgProcessingTime = avgProcessingTimeResult.length > 0
      ? avgProcessingTimeResult[0].avgTime
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalInvoices,
        processedInvoices,
        pendingReview,
        totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
        processingRate: parseFloat(processingRate.toFixed(2)),
        avgProcessingTime: Math.round(avgProcessingTime) // in milliseconds
      }
    });
  } catch (error) {
    console.error('Get analytics summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics summary',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get analytics trends
// @route   GET /api/analytics/trends
// @access  Private
exports.getTrends = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = 'monthly' } = req.query; // daily, weekly, monthly
    const { startDate, endDate } = req.query;

    // Default to last 6 months if no dates provided
    let start = startDate ? new Date(startDate) : new Date();
    start.setMonth(start.getMonth() - 6); // last 6 months
    let end = endDate ? new Date(endDate) : new Date();

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Ensure start is before end
    if (start > end) {
      [start, end] = [end, start];
    }

    // Define grouping based on period
    let groupBy;
    switch (period) {
      case 'daily':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'monthly':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid period. Use daily, weekly, or monthly'
        });
    }

    // Invoice volume trend
    const invoiceVolumeTrend = await Invoice.aggregate([
      {
        $match: {
          user_id: userId,
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 }
      }
    ]);

    // Average processing time trend (from completed jobs)
    const processingTimeTrend = await ProcessingJob.aggregate([
      {
        $match: {
          user_id: userId,
          status: 'completed',
          processing_time_ms: { $exists: true, $ne: null },
          completed_at: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: groupBy,
          avgTime: { $avg: '$processing_time_ms' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 }
      }
    ]);

    // Success rate trend (percentage of invoices that are validated/approved/exported)
    const successRateTrend = await Invoice.aggregate([
      {
        $match: {
          user_id: userId,
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: groupBy,
          total: { $sum: 1 },
          success: {
            $sum: {
              $cond: [
                { $in: ['$status', ['validated', 'approved', 'exported']] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          successRate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $multiply: [{ $divide: ['$success', '$total'] }, 100] }
            ]
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 }
      }
    ]);

    // Format the data for frontend consumption
    const formatTrendData = (data, period) => {
      return data.map(item => {
        let dateLabel;
        if (period === 'daily') {
          dateLabel = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`;
        } else if (period === 'weekly') {
          dateLabel = `${item._id.year}-W${String(item._id.week).padStart(2, '0')}`;
        } else if (period === 'monthly') {
          dateLabel = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
        }

        return {
          date: dateLabel,
          value: period === 'monthly' && data === successRateTrend
            ? parseFloat(item.successRate.toFixed(2))
            : period === 'monthly' && data === processingTimeTrend
            ? Math.round(item.avgTime)
            : item.count
        };
      });
    };

    res.status(200).json({
      success: true,
      data: {
        period,
        dateRange: {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
        },
        trends: {
          invoiceVolume: formatTrendData(invoiceVolumeTrend, period),
          averageProcessingTime: formatTrendData(processingTimeTrend, period),
          successRate: formatTrendData(successRateTrend, period)
        }
      }
    });
  } catch (error) {
    console.error('Get analytics trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics trends',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get vendor analytics
// @route   GET /api/analytics/vendors
// @access  Private
exports.getVendorAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;

    const vendorStats = await Invoice.aggregate([
      {
        $match: {
          user_id: userId
        }
      },
      {
        $lookup: {
          from: 'vendors',
          localField: 'vendor_id',
          foreignField: '_id',
          as: 'vendor'
        }
      },
      {
        $unwind: {
          path: '$vendor',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$vendor_id',
          vendorName: { $first: '$vendor.name' },
          vendorTaxId: { $first: '$vendor.tax_id' },
          invoiceCount: { $sum: 1 },
          totalAmount: { $sum: '$total_amount' },
          avgAmount: { $avg: '$total_amount' },
          processedCount: {
            $sum: {
              $cond: [
                { $in: ['$status', ['extracted', 'validated', 'reviewed', 'approved', 'exported']] },
                1,
                0
              ]
            }
          },
          pendingCount: {
            $sum: {
              $cond: [
                { $in: ['$status', ['draft', 'processing', 'extracted']] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          vendorId: '$_id',
          vendorName: 1,
          vendorTaxId: 1,
          invoiceCount: 1,
          totalAmount: 1,
          avgAmount: { $round: ['$avgAmount', 2] },
          processedCount: 1,
          pendingCount: 1,
          processingRate: {
            $cond: [
              { $eq: ['$invoiceCount', 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ['$processedCount', '$invoiceCount'] }, 100] }, 2] }
            ]
          }
        }
      },
      {
        $sort: { invoiceCount: -1 }
      },
      {
        $limit: limit
      }
    ]);

    res.status(200).json({
      success: true,
      data: vendorStats
    });
  } catch (error) {
    console.error('Get vendor analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getSummary: exports.getSummary,
  getTrends: exports.getTrends,
  getVendorAnalytics: exports.getVendorAnalytics
};