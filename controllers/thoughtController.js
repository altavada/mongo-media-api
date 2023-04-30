const { Thought, User } = require("../models");

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "Thought not found" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  async createThought(req, res) {
    try {
      let response = await Thought.create(req.body);
      let userRes = await User.findOneAndUpdate(
        { username: req.body.username },
        { $addToSet: { thoughts: response._id } },
        { new: true }
      );
      if (response) {
        !userRes
          ? res.status(404).json({
              message: "Thought created, but valid user not provided.",
            })
          : res.status(200).json(response);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "Thought not found" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "Thought not found" })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Thought removed but no associated user found.",
            })
          : res.json({ message: "Thought removed" })
      )
      .catch((err) => res.status(500).json(err));
  },
  createThoughtReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "Thought not found" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteThoughtReaction(req, res) {
    try {
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      ).then((thought) =>
        !thought
          ? res.status(404).json({ message: "Thought not found." })
          : res.status(200).json(thought)
      );
    } catch (err) {
      console.log("error", err);
      res.status(500).json(err);
    }
  },
};
