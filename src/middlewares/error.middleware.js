export const notFound = (req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).json({ message: err.message });
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Invalid JSON" });
    }

    if (err.code === "P2002") {
        return res.status(409).json({ message: "Value already exists" });
    }

    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
};