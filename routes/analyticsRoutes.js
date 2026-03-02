const express = require("express");
const router = express.Router();
const Analytics = require("../models/Analytics");

// GET /api/analytics - Get all analytics data
router.get("/", async (req, res) => {
  try {
    const analytics = await Analytics.find().sort({ year: -1, month: -1 }).limit(12);
    res.json(analytics);
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/analytics/monthly - Get current month analytics
router.get("/monthly", async (req, res) => {
  try {
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    let analytics = await Analytics.findOne({ month: currentMonth, year: currentYear });

    if (!analytics) {
      // Create new analytics entry for current month
      analytics = new Analytics({
        month: currentMonth,
        year: currentYear,
        pageViews: 0,
        uniqueVisitors: 0,
        placesVisited: 0,
        busesViewed: 0,
        contactMessages: 0,
      });
      await analytics.save();
    }

    res.json(analytics);
  } catch (error) {
    console.error("Get monthly analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/analytics/overview - Get overview stats
router.get("/overview", async (req, res) => {
  try {
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    // Get current month
    const currentMonthAnalytics = await Analytics.findOne({ month: currentMonth, year: currentYear });

    // Get last 6 months
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const lastSixMonths = await Analytics.find({
      $or: [
        { year: { $gt: sixMonthsAgo.getFullYear() } },
        { year: sixMonthsAgo.getFullYear(), month: { $gte: monthNames[sixMonthsAgo.getMonth()] } }
      ]
    }).sort({ year: -1, month: -1 }).limit(6);

    // Calculate totals
    const totalPageViews = lastSixMonths.reduce((sum, item) => sum + item.pageViews, 0);
    const totalVisitors = lastSixMonths.reduce((sum, item) => sum + item.uniqueVisitors, 0);
    const totalPlacesVisited = lastSixMonths.reduce((sum, item) => sum + item.placesVisited, 0);
    const totalBusesViewed = lastSixMonths.reduce((sum, item) => sum + item.busesViewed, 0);

    res.json({
      currentMonth: currentMonthAnalytics || {
        month: currentMonth,
        year: currentYear,
        pageViews: 0,
        uniqueVisitors: 0,
        placesVisited: 0,
        busesViewed: 0,
        contactMessages: 0,
      },
      lastSixMonths,
      totals: {
        pageViews: totalPageViews,
        visitors: totalVisitors,
        placesVisited: totalPlacesVisited,
        busesViewed: totalBusesViewed,
      },
    });
  } catch (error) {
    console.error("Get overview error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/analytics/monthly - Update current month analytics
router.put("/monthly", async (req, res) => {
  try {
    const { pageViews, uniqueVisitors, placesVisited, busesViewed, contactMessages } = req.body;
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    const analytics = await Analytics.findOneAndUpdate(
      { month: currentMonth, year: currentYear },
      {
        month: currentMonth,
        year: currentYear,
        pageViews: pageViews || 0,
        uniqueVisitors: uniqueVisitors || 0,
        placesVisited: placesVisited || 0,
        busesViewed: busesViewed || 0,
        contactMessages: contactMessages || 0,
      },
      { new: true, upsert: true }
    );

    res.json(analytics);
  } catch (error) {
    console.error("Update monthly analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/analytics/track - Track an event (can be called from frontend)
router.post("/track", async (req, res) => {
  try {
    const { eventType } = req.body; // 'pageView', 'placeVisit', 'busView', 'contact'
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    const updateField = {
      pageView: "pageViews",
      placeVisit: "placesVisited",
      busView: "busesViewed",
      contact: "contactMessages",
    }[eventType];

    if (!updateField) {
      return res.status(400).json({ message: "Invalid event type" });
    }

    const analytics = await Analytics.findOneAndUpdate(
      { month: currentMonth, year: currentYear },
      { $inc: { [updateField]: 1 } },
      { new: true, upsert: true }
    );

    res.json(analytics);
  } catch (error) {
    console.error("Track event error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
