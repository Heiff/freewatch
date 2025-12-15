const Movie = require("../models/Movie")

const GetAll = async(req,res) =>{
    try {
        const data = await Movie.findAll({order: [['id', 'DESC']] });
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const ByPage = async(req,res) =>{
    try {
    const page = parseInt(req.query.page) || 1; // default 1
    const limit = parseInt(req.query.limit) || 5; // default 5
    const offset = (page - 1) * limit;

    const { count, rows } = await Movie.findAndCountAll({
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      movies: rows,
    });
    } catch (error) {
        res.status(500).json(error.message)
    }
}


const GetOne = async(req,res) =>{
    try {
        const { id } = req.params;
        const data = await Movie.findOne({where:{id:id}})
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error.message)
    }
}


const Delete = async(req,res) =>{
    try {
        const { id } = req.params;
        await Movie.destroy({where:{id:id}});
        res.status(200).json({message:"succes"});
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const Update = async(req,res) =>{
    try {
        const { id,title } = req.body;
        const data = await Movie.update({title},{where:{id}});
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = {
    Update,GetAll,GetOne,Delete,ByPage
}