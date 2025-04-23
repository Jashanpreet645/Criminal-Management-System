import express from "express"
import * as criminalModel from "../models/criminal.js"

const router = express.Router()

// Get all criminals
router.get("/", async (req, res) => {
  try {
    console.log('Fetching all criminals...');
    const criminals = await criminalModel.getAllCriminals()
    console.log('Retrieved criminals:', criminals);
    
    if (!Array.isArray(criminals)) {
      console.error('getAllCriminals did not return an array:', criminals);
      return res.status(500).json({ message: "Invalid data format received from database" });
    }
    
    res.json(criminals)
  } catch (error) {
    console.error('Error in GET / route:', error);
    res.status(500).json({ message: "Error fetching criminals", error: error.message })
  }
})

// Search criminals
router.get("/search", async (req, res) => {
  try {
    const { term } = req.query
    if (!term) {
      return res.status(400).json({ message: "Search term is required" })
    }
    const criminals = await criminalModel.searchCriminals(term)
    res.json(criminals)
  } catch (error) {
    res.status(500).json({ message: "Error searching criminals", error: error.message })
  }
})

// Get criminal by ID
router.get("/:id", async (req, res) => {
  try {
    const criminal = await criminalModel.getCriminalById(req.params.id)
    if (!criminal) {
      return res.status(404).json({ message: "Criminal not found" })
    }
    res.json(criminal)
  } catch (error) {
    res.status(500).json({ message: "Error fetching criminal", error: error.message })
  }
})

// Create new criminal
router.post("/", async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      "case_id",
      "criminal_no",
      "criminal_name",
      "crime_type",
      "arrest_date",
      "crime_date",
      "gender",
      "address",
      "age",
    ]
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` })
      }
    }

    // Convert most_wanted to boolean if it's a string
    if (typeof req.body.most_wanted === "string") {
      req.body.most_wanted = req.body.most_wanted.toLowerCase() === "yes" || req.body.most_wanted === "true"
    }

    const newCriminal = await criminalModel.createCriminal(req.body)
    res.status(201).json(newCriminal)
  } catch (error) {
    res.status(500).json({ message: "Error creating criminal record", error: error.message })
  }
})

// Update criminal
router.put("/:id", async (req, res) => {
  try {
    const criminal = await criminalModel.getCriminalById(req.params.id)
    if (!criminal) {
      return res.status(404).json({ message: "Criminal not found" })
    }

    // Convert most_wanted to boolean if it's a string
    if (typeof req.body.most_wanted === "string") {
      req.body.most_wanted = req.body.most_wanted.toLowerCase() === "yes" || req.body.most_wanted === "true"
    }

    const result = await criminalModel.updateCriminal(req.params.id, req.body)
    res.json({ message: "Criminal updated successfully", ...result })
  } catch (error) {
    res.status(500).json({ message: "Error updating criminal", error: error.message })
  }
})

// Delete criminal
router.delete("/:id", async (req, res) => {
  try {
    const criminal = await criminalModel.getCriminalById(req.params.id)
    if (!criminal) {
      return res.status(404).json({ message: "Criminal not found" })
    }

    const result = await criminalModel.deleteCriminal(req.params.id)
    res.json({ message: "Criminal deleted successfully", ...result })
  } catch (error) {
    res.status(500).json({ message: "Error deleting criminal", error: error.message })
  }
})

export default router

