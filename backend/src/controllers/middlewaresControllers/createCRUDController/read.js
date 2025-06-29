const read = async (Model, req, res) => {
  try {
    console.log('Incoming request:', { params: req.params, query: req.query, body: req.body });
    // Find document by id
    const result = await Model.findOne({
      _id: req.params.id,
      removed: false,
    }).exec();
    // If no results found, return document not found
    if (!result) {
      console.warn('Document not found:', req.params.id);
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found ',
      });
    } else {
      // Return success response
      console.log('Document found:', result);
      return res.status(200).json({
        success: true,
        result,
        message: 'we found this document ',
      });
    }
  } catch (error) {
    console.error('Error during read operation:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Server error occurred',
    });
  }
};

module.exports = read;
