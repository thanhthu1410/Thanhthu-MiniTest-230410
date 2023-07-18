import express from "express";
const router = express.Router();
import fs from "fs"
import path from "path";
import multiparty from "multiparty"


router.get("/", (req, res) => {

    fs.readFile(path.join(__dirname, "todo.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json(
                {
                    message: "failed",
                }
            )
        }
        return res.status(200).json(
            {
                message: "success",
                data: JSON.parse(data)
            }
        )
    })
})
router.delete('/:todoId', (req, res) => {
    if (req.params.todoId) {
        fs.readFile(path.join(__dirname, "todo.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy todo thất bại!"
                })
            }
            let meos = JSON.parse(data);
            meos = meos.filter(meo => meo.id != req.params.todoId);

            fs.writeFile(path.join(__dirname, "todo.json"), JSON.stringify(meos), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                return res.status(200).json({
                    message: "Xóa todo thành công!"
                })
            })
        })
    } else {
        return res.status(500).json(
            {
                message: "Vui lòng truyền todoId!"
            }
        )
    }
})

router.post('/', (req, res) => {

    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send("Lỗi đọc form!")
        }
        let newTodo = {
            todoId: 1,
            id: Date.now(),
            title: fields.title[0],
            completed: false
        }

        fs.readFile(path.join(__dirname, "todo.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json(
                    {
                        message: "Đọc dữ liệu thất bại!"
                    }
                )
            }
            let oldData = JSON.parse(data);
            for(let i in oldData){
                if(oldData[i].title.includes(newTodo.title)){
                  
                        return res.status(500).json(
                            {
                                message: "Dữ liệu bị trùng!"
                            }
                        )
                    
                }
            }
                    oldData.unshift(newTodo)
                    fs.writeFile(path.join(__dirname, "todo.json"), JSON.stringify(oldData), (err) => {
                        if (err) {
                            return res.status(500).json(
                                {
                                    message: "Ghi file thất bại!"
                                }
                            )
                        }
                        return res.redirect("/todos")
                    })
                
            }

           
        )
    })
})
router.patch("/:id", (req, res) => {
    fs.readFile(path.join(__dirname, "todo.json"), 'utf-8', (err, data) => {

        const dataObj = JSON.parse(data)
        console.log("dataObj", dataObj);
        let todoPatch;
        if (req.params.id) {
            let flag = false
         const   newDataObj = dataObj.map((todo) => {
                if (todo.id == req.params.id) {
                    flag = true;
                    todoPatch = {
                        ...todo,
                        ...req.body
                    }
                    return  {
                        ...todo,
                        ...req.body
                    }
                }
                return todo
            })
        
            fs.writeFile(path.join(__dirname, "meo.json"), JSON.stringify(newDataObj), (err) => {
                if (err) {
                    return res.status(500).json(
                        {
                            message: "Ghi file thất bại!"
                        }
                    )
                }
                return res.redirect("/todos")
            })
            if (!flag) {
                return res.status(500).json({
                    message: req.params.id + " - khong ton tai "
                })
            }

        
            return res.status(200).json(
                {
                    message: "patch thanh cong" + req.params.id,
                    data: todoPatch
                })
        }

    })
})

module.exports = router;