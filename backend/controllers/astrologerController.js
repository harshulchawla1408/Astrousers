import Astrologer from "../models/astrologerModel.js";
import User from "../models/user.js";
import { getIO } from "../socket/socketServer.js";

// Get all astrologers with search and filter functionality
export const getAllAstrologers = async (req, res) => {
  try {
    const { search, category, gender, language, expertise, sortBy, sortOrder } = req.query;
    
    // Build filter object
    let filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { expertise: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    
    if (gender) {
      filter.gender = gender;
    }
    
    if (language) {
      filter.languages = { $in: [new RegExp(language, 'i')] };
    }
    
    if (expertise) {
      filter.expertise = { $regex: expertise, $options: 'i' };
    }

    // Build sort object
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.rating = -1; // Default sort by rating descending
    }

    const astrologers = await Astrologer.find(filter)
      .sort(sort)
      .select('-__v');

    res.status(200).json({
      success: true,
      count: astrologers.length,
      data: astrologers
    });
  } catch (error) {
    console.error('Error fetching astrologers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching astrologers',
      error: error.message
    });
  }
};

// Get single astrologer by ID
export const getAstrologerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const astrologer = await Astrologer.findById(id).select('-__v');
    
    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: 'Astrologer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: astrologer
    });
  } catch (error) {
    console.error('Error fetching astrologer:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching astrologer',
      error: error.message
    });
  }
};

// Create new astrologer (for admin use)
export const createAstrologer = async (req, res) => {
  try {
    const astrologer = new Astrologer(req.body);
    await astrologer.save();

    res.status(201).json({
      success: true,
      data: astrologer
    });
  } catch (error) {
    console.error('Error creating astrologer:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating astrologer',
      error: error.message
    });
  }
};

// Update astrologer
export const updateAstrologer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const astrologer = await Astrologer.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: 'Astrologer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: astrologer
    });
  } catch (error) {
    console.error('Error updating astrologer:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating astrologer',
      error: error.message
    });
  }
};

// Delete astrologer
export const deleteAstrologer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const astrologer = await Astrologer.findByIdAndDelete(id);

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: 'Astrologer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Astrologer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting astrologer:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting astrologer',
      error: error.message
    });
  }
};

// Get top rated astrologers (for home page)
export const getTopAstrologers = async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    
    const astrologers = await Astrologer.find({ online: true })
      .sort({ rating: -1, reviews: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      count: astrologers.length,
      data: astrologers
    });
  } catch (error) {
    console.error('Error fetching top astrologers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top astrologers',
      error: error.message
    });
  }
};

// Update all astrologers to be online and available
export const makeAllAstrologersOnline = async (req, res) => {
  try {
    const result = await Astrologer.updateMany(
      {},
      { 
        online: true,
        'availability.chat': true,
        'availability.call': true,
        'availability.video': true
      }
    );

    res.status(200).json({
      success: true,
      message: 'All astrologers are now online and available',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating astrologers:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating astrologers',
      error: error.message
    });
  }
};

// Set astrologer online (presence)
export const setAstrologerOnline = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify user is the astrologer
    const user = await User.findOne({ clerkId: userId });
    if (!user || user.role !== 'astrologer' || user.clerkId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only astrologers can set their own online status'
      });
    }

    await User.findOneAndUpdate(
      { clerkId: id },
      { isOnline: true, lastSeen: new Date() }
    );

    // Note: Astrologer model uses MongoDB _id, but we're using clerkId here
    // If you need to sync, you'll need to map clerkId to astrologer _id

    // Broadcast updated online list
    const io = getIO();
    if (io) {
      const onlineAstrologers = await User.find({ 
        role: 'astrologer', 
        isOnline: true 
      }).select('clerkId name profileImage');
      io.emit('presence:online-list', { astrologers: onlineAstrologers });
    }

    res.status(200).json({
      success: true,
      message: 'Astrologer is now online'
    });
  } catch (error) {
    console.error('Error setting astrologer online:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting astrologer online',
      error: error.message
    });
  }
};

// Set astrologer offline (presence)
export const setAstrologerOffline = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify user is the astrologer
    const user = await User.findOne({ clerkId: userId });
    if (!user || user.role !== 'astrologer' || user.clerkId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only astrologers can set their own offline status'
      });
    }

    await User.findOneAndUpdate(
      { clerkId: id },
      { isOnline: false, lastSeen: new Date() }
    );

    // Note: Astrologer model uses MongoDB _id, but we're using clerkId here
    // If you need to sync, you'll need to map clerkId to astrologer _id

    // Broadcast updated online list
    const io = getIO();
    if (io) {
      const onlineAstrologers = await User.find({ 
        role: 'astrologer', 
        isOnline: true 
      }).select('clerkId name profileImage');
      io.emit('presence:online-list', { astrologers: onlineAstrologers });
    }

    res.status(200).json({
      success: true,
      message: 'Astrologer is now offline'
    });
  } catch (error) {
    console.error('Error setting astrologer offline:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting astrologer offline',
      error: error.message
    });
  }
};

// Get online astrologers
export const getOnlineAstrologers = async (req, res) => {
  try {
    const onlineUsers = await User.find({ 
      role: 'astrologer', 
      isOnline: true 
    }).select('clerkId name profileImage lastSeen');

    res.status(200).json({
      success: true,
      count: onlineUsers.length,
      data: onlineUsers
    });
  } catch (error) {
    console.error('Error fetching online astrologers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching online astrologers',
      error: error.message
    });
  }
};

// Check if clerkId exists in astrologers collection
export const checkAstrologerByClerkId = async (req, res) => {
  try {
    const { clerkId } = req.params;
    
    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: "clerkId is required"
      });
    }

    const astrologer = await Astrologer.findOne({ clerkId });
    
    res.status(200).json({
      success: true,
      exists: !!astrologer,
      astrologer: astrologer ? {
        _id: astrologer._id,
        name: astrologer.name,
        expertise: astrologer.expertise,
        online: astrologer.online
      } : null
    });
  } catch (error) {
    console.error('Error checking astrologer:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking astrologer',
      error: error.message
    });
  }
};