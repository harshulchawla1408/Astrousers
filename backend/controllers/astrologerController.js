import Astrologer from "../models/astrologerModel.js";

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
