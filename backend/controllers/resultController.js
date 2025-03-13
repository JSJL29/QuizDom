const Result = require('../models/Result');
const User = require('../models/User');
const Categorie = require('../models/Categorie');
const { Op } = require('sequelize');

exports.getAllResults = async (req, res) => {
    try {
        const results = await Result.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username', 'email']
                },
                {
                    model: Categorie,
                    as: 'categorie',
                    attributes: ['title']
                }
            ]
        });
        res.status(200).json(results);
    } catch (error) {
        console.error('Error retrieving results:', error);
        res.status(500).json({ message: "Error retrieving results." });
    }
};

exports.getUserResults = async (req, res) => {
    try {
        const results = await Result.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: Categorie,
                as: 'categorie',
                attributes: ['title']
            }],
            order: [['completed_at', 'DESC']]
        });
        res.json(results);
    } catch (error) {
        console.error('Error retrieving results.', error);
        res.status(500).json({ message: "Error retrieving results" });
    }
};

exports.createResult = async (req, res) => {
    try {
        const { categorie_id, score } = req.body;
        
        if (!categorie_id || score === undefined) {
            return res.status(400).json({ 
                message: "category_id and score are required" 
            });
        }

        const newResult = await Result.create({
            user_id: req.user.id, 
            categorie_id,
            score
        });

        res.status(201).json({ 
            message: "Result saved successfully",
            result: newResult 
        });
    } catch (error) {
        console.error('Error creating result:', error);
        res.status(500).json({ message: "Error creating result." });
    }
};

exports.deleteResult = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Result.findByPk(id);
        
        if (!result) {
            return res.status(404).json({ message: "Result not found" });
        }

        if (req.user.role !== 'admin' && result.user_id !== req.user.id) {
            return res.status(403).json({ 
                message: "You do not have the rights to delete this result" 
            });
        }

        await result.destroy();
        
        res.status(200).json({ 
            message: "Result deleted successfully",
            resultId: id 
        });
    } catch (error) {
        console.error('Error deleting result:', error);
        res.status(500).json({ message: "Error deleting result." });
    }
};

exports.getResultsByCategorie = async (req, res) => {
    try {
        const categorieId = req.params.categorieId;
        const results = await Result.findAll({
            where: { categorie_id: categorieId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username']
                }
            ],
            order: [['score', 'DESC']]
        });
        res.status(200).json(results);
    } catch (error) {
        console.error('Error retrieving results by category:', error);
        res.status(500).json({ message: "Error retrieving results by category." });
    }
};