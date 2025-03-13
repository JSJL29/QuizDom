const Categorie = require('../models/Categorie');
const { Op } = require('sequelize');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Categorie.findAll({
            include: [{
                association: 'creator',
                attributes: ['username', 'email']
            }]
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error retrieving categories: ', error);
        res.status(500).json({ message: "Error retrieving categories." });
    }
};

exports.createCategorie = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const existingCategorie = await Categorie.findOne({
            where: { title }
        });

        if (existingCategorie) {
            return res.status(409).json({ message: 'A category with this title already exists.' });
        }

        const newCategorie = await Categorie.create({
            title,
            creator_id: req.user.id
        });

        res.status(201).json({ 
            message: 'Category created successfully!',
            categorie: newCategorie 
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: "Error creating category." });
    }
};

exports.deleteCategorie = async (req, res) => {
    try {
        const { id } = req.params;

        const categorie = await Categorie.findByPk(id);
        
        if (!categorie) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (req.user.role !== 'admin' && categorie.creator_id !== req.user.id) {
            return res.status(403).json({ 
                message: "You do not have the rights to delete this category." 
            });
        }

        await categorie.destroy();
        
        res.status(200).json({ 
            message: "Category deleted successfully",
            categorieId: id 
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: "Error deleting category." });
    }
};

exports.findCategoryIdByTitle = async (req, res) => {
    try {
        const { title } = req.params;
        
        const category = await Categorie.findOne({
            where: { title },
            attributes: ['id'] 
        });

        if (category) {
            return res.status(200).json({ id: category.id }); 
        } else {
            return res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        console.error('Error finding category by title:', error);
        res.status(500).json({ message: "Error finding category by title." }); 
    }
};