const express = require('express');
const { createPoll, getPollResults, getLeaderboard } = require('../db');
const router = express.Router();

const pollRoutes = (producer) => {

    router.post('/polls', async (req, res) => {
        const { title, options } = req.body;
        try {
            const pollId = await createPoll(title, options);
            res.status(201).json({ id: pollId, message: 'Poll created successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Error creating poll' });
        }
    });

    router.post('/polls/:id/vote', async (req, res) => {
        const { id } = req.params;
        const { optionId } = req.body;
        try {
            await producer.send({
                topic: 'votes',
                messages: [{ value: JSON.stringify({ pollId: id, optionId }) }]
            });
            res.status(200).json({ message: 'Vote registered successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Error processing vote' });
        }
    });

    router.get('/polls/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const pollResults = await getPollResults(id);
            if (!pollResults) {
                res.status(404).json({ error: 'Poll not found' });
            } else {
                res.status(200).json(pollResults);
            }
        } catch (err) {
            res.status(500).json({ error: 'Error retrieving poll results' });
        }
    });

    router.get('/leaderboard', async (req, res) => {
        try {
            const leaderboard = await getLeaderboard();
            res.status(200).json(leaderboard);
        } catch (err) {
            res.status(500).json({ error: 'Error retrieving leaderboard' });
        }
    });

    return router;
}

module.exports = { pollRoutes };
