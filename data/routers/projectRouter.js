const express = require("express");
const Projects = require("../helpers/projectModel");

const router = express.Router();

// GET request - get project(s)
router.get("/", (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Unable to retrieve projects."
            })
        })
})

// GET request - get a project by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;

    Projects.get(id)
        .then(project => {
            project ? res.status(201).send(project) : res.status(404).send("Project not found")
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "error", error
            });
        })
})

// GET request - get project action(s) by project ID
router.get("/:id/actions", (req, res) => {
    const { id } = req.params;

    Projects.get(id)
        .then(project => {
            project ? res.status(200).send(project.actions) : res.status(404).send("Actions not found")
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Error."
            });
        })
})

// POST request - adding new project(s)
router.post("/", (req, res) => {
    const newProject = req.body;

    Projects.insert(newProject)
        .then(project => {
            res.status(201).json({ sucess: true, project });
        })
        .catch(err => {
            res.status(500).json({ sucess: false, err })
        })
})

// PUT request
router.put("/:id", validatePut, (req, res) => {
    const { id } = req.params;
    const updatedProject = req.body;

    Projects.update(id, updatedProject)
        .then(project => {
            project ? res.status(200).json({success: true, project}) : res.status(404).send("Not found")
        })
        .catch(err => {
            res.status(500).json({ success: false, error });
        })
})

// DELETE request
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    Projects.remove(id)
        .then(project => {
            res.status(204).json({ success: true, project, message: "Project is deleted."});
        })
        .catch(err => {
            res.status(500).json({ success: false, err })
        })
})

// Middleware
function validatePut(req, res, next) {
    if (!req.body) {
        res.status(400).json({
            message: "missing data"
        });
    }
    else {
        if (!req.body.hasOwnProperty('name') && !req.body.hasOwnProperty('description')) {
            res.status(400).json({
                message: "missing required name or description field"
            });
        }
        else {
            next();
        }
    }
}

module.exports = router;