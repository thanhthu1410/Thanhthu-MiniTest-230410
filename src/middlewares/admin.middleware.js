let isAdmin = false
module.exports = {
    adminCheck: function(req,res,next){
            if(isAdmin){
                next()
            }else{
                res.status(200).json(
                    {
                        message : 'khong phai admin'
                    }
                )
            }
    }
}