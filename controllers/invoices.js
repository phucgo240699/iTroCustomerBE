const { model } = require("mongoose");
const { isElement, isEmpty } = require("lodash");

exports.getAll = async (req, res) => {
  try {
    const page = Number(req.query.page); // page index
    const limit = Number(req.query.limit); // limit docs per page
    const roomId = req.body.roomId;

    let invoices;

    if (isEmpty(req.body.roomId)) {
      return res.status(406).json({
        success: false,
        error: "Not enough property"
      });
    }

    let query;
    if (!isEmpty(req.user.owner)) {
      const customer = model("customers").findOne({ _id: req.user.owner });
      query = { roomId: customer.roomId, isDeleted: false };
    } else {
      query = { isDeleted: false };
    }

    if (!page || !limit) {
      // Not paginate if request doesn't has one of these param: page, limit
      invoices = await model("invoices")
        .find(query)
        .select("roomId totalPrice")
        .populate("roomId", "name");
    } else {
      // Paginate
      invoices = await model("invoices")
        .aggregate()
        .find(query)
        .select("roomId totalPrice")
        .populate("roomId", "name")
        .skip(limit * (page - 1))
        .limit(limit);
    }

    return res.status(200).json({
      success: true,
      data: invoices
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
