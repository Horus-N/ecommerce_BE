const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true,
       
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisliked:{
        type:Boolean,
        default:false,
    },
    likes:[
        {
            // mongoose.Schema.Types.ObjectId, bạn đang nói với Mongoose rằng t
            // rường này sẽ lưu trữ một ObjectId, một loại dữ liệu đặc biệt 
            // được sử dụng để tham chiếu đến một tài nguyên khác trong cơ sở dữ liệu MongoDB.

            // Thuộc tính ref được sử dụng để chỉ định tên của một model khác trong ứng dụng của 
            // bạn mà ObjectId này tham chiếu đến. Trong trường hợp này, ref: "User" có nghĩa là ObjectId 
            // trong trường sẽ tham chiếu đến các tài nguyên được lưu trữ trong bảng User
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    images:{type:Array},
    author:{
        type:String,
        default:"Admin"
    }
},{
    
// Trong Mongoose, các tùy chọn toJSON và toObject được sử dụng để xác định cách 
// mà các tài liệu của schema sẽ được biến đổi thành đối tượng JSON hoặc JavaScript.
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    // timestamps: Tùy chọn này tự động thêm hai trường createdAt và updatedAt vào 
    // các tài liệu của schema. Trường createdAt sẽ được đặt là thời gian tạo ra tài liệu, và trường 
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);