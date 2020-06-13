const express = require("express");

const Actions = require("../helpers/actionModel");

router = express.Router();

// GET request
router.get("/", (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Unable to retrieve actions."
            })
        })
})

// GET request by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;

    Actions.get(id)
        .then(action => {
            res.status(200).json(action);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Unable to retrieve the action."
            })
        })
})

// POST request
// router.post("/", validatePost, (req, res) => {
//     res.status(200).json(req.a)
// })

// POST request
router.post('/', (req, res) => {

    const newAction = req.body;

    Actions.insert(newAction)
        .then( action => {
            res.status(201).json({success: true, action});
        })
        .catch( err => {
            res.status(500).json({success: false, message: err.message})
        });
});

// PUT request
router.put("/:id", validatePut, (req, res) => {
    const { id } = req.params;
    const updatedAction = req.body;

    Actions.update(id, updatedAction)
        .then(action => {
            action ? res.status(201).json({ success: true, action }) : res.status(404).send("Not found")
        })
        .catch(err => {
            res.status(500).json({ success: false, error });
        })
})

// Delete Request
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    Actions.remove(id)
        .then(action => {
            res.status(204).json({ success: true, action, message: "Action is deleted."});
        })
        .catch(err => {
            res.status(500).json({ success: false, err })
        });
})

// Middleware
function validatePut(req, res, next) {
    if (!req.body) {
        res.status(400).json({
            message: "Missing actions data"
        })
    }
    else {
        if (!req.body.hasOwnProperty("description") && !req.body.hasOwnProperty("notes")) {
            res.status(400).json({
                message: "Missing description or notes field"
            })
        }
        else {
            next();
        }
    }
}

// function validatePost(req, res, next) {
//     const { id } = req.params;
//     const action = { ...req.body, project_id: id };

//     Actions.insert(action)
//         .then(a => {
//             !a & console.log(a) ? res.status(400).json({ message: "No action" })
//             :
//             !a.description ? res.status(400).json({ message: "Missing action description." })
//             :
//             !a.notes ? res.status(400).json({ message: "Missing action description." })
//             :
//             (req.uPost = u) & (console.log(u)) & next()
//         })
//         .catch(err => res.status(500).json({ message: "Error" }))
// }

module.exports = router;