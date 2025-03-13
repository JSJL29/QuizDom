const Question = require('../models/Question');
const Categorie = require('../models/Categorie');
const { Op } = require('sequelize');
const { Sequelize } = require('../config/database');

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll({
            include: [{
                model: Categorie,
                as: 'categorie',
                attributes: ['title']
            }]
        });
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error retrieving questions:', error);
        res.status(500).json({ message: "Error retrieving questions." });
    }
};

exports.getQuestionsByCategory = async (req, res) => {
    try {
        const questions = await Question.findAll({
            where: { categorie_id: req.params.id },
            order: Sequelize.literal('RAND()'),
            limit: 5
        });
        res.json(questions);
    } catch (error) {
        console.error('Error retrieving questions:', error);
        res.status(500).json({ message: "Error retrieving questions:" });
    }
};

exports.createQuestion = async (req, res) => {
    try {
        const { categorie_id, content, option_a, option_b, option_c, option_d, correct_option } = req.body;

        if (!categorie_id || !content || !option_a || !option_b || !option_c || !option_d || !correct_option) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const categorie = await Categorie.findByPk(categorie_id);
        if (!categorie) {
            return res.status(404).json({ message: "Category not found" });
        }

        const newQuestion = await Question.create({
            categorie_id,
            content,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option
        });

        res.status(201).json({ 
            message: 'Question created successfully!',
            question: newQuestion 
        });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ message: "Error creating question:" });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findByPk(id);
        
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                message: "You do not have the rights to delete this question." 
            });
        }

        await question.destroy();
        
        res.status(200).json({ 
            message: "Question deleted successfully",
            questionId: id 
        });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: "Error deleting question." });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { categorie_id, content, option_a, option_b, option_c, option_d, correct_option } = req.body;

        // Find the question by ID
        const question = await Question.findByPk(id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Check for admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                message: "You do not have the rights to update this question." 
            });
        }

        // If a category is provided, ensure it exists
        if (categorie_id) {
            const categorie = await Categorie.findByPk(categorie_id);
            if (!categorie) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        // Update the question with new data
        await question.update({
            categorie_id: categorie_id || question.categorie_id,
            content: content || question.content,
            option_a: option_a || question.option_a,
            option_b: option_b || question.option_b,
            option_c: option_c || question.option_c,
            option_d: option_d || question.option_d,
            correct_option: correct_option || question.correct_option
        });

        res.status(200).json({ 
            message: "Question updated successfully",
            question 
        });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: "Error updating question." });
    }
};
 