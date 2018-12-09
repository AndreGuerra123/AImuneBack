module.exports = {
    image: async (req, res, next) => {
        egfs = req.app.get('egfs')
        await egfs.getFileData(req.query.image_id, function(err,data){
            if(err){
                res.status(400).json(err) 
            }else{
                res.status(200).json(data)
            }
        })
        next();
    }
}