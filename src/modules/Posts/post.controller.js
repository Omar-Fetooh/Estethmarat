import {
  CharityOrganization,
  Post,
  supportOrganization,
} from '../../../DB/models/index.js';
import { cloudinaryConfig } from '../../Utils/cloudinary.js';
import { AppError } from '../../Utils/AppError.js';
export const createPost = async (req, res, next) => {
  const { title, content, organizationType } = req.body;

  const organizationId = req.user._id;

  const organization =
    (await CharityOrganization.findById(organizationId)) ||
    (await supportOrganization.findById(organizationId));

  if (!organization) {
    return next(new AppError('organization is not found'));
  }

  let postObj = {
    title,
    content,
    organizationId,
    organizationType,
  };

  if (req.file) {
    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADS_FOLDER}/Posts/`,
      }
    );
    postObj = {
      title,
      content,
      organizationId,
      attachedImage: { secure_url, public_id },
      organizationType,
    };
  }

  const post = await Post.create(postObj);

  res.status(201).json({ message: 'post created successfully', post });
};

export const getAllPostsOfOrganization = async (req, res, next) => {
  const { organizationId } = req.query;
  const posts = await Post.find({ organizationId }).populate('organizationId');

  res.status(200).json({ message: 'All posts fetched successfully', posts });
};

export const getPostById = async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError('post not found', 404));
  }

  res.status(201).json({ message: 'post fetched successfully', post });
};

// export const updatePostById = async (req, res, next) => {
//   const { postId } = req.params;

//   const { title, content } = req.body;
//   const post = await Post.findById(postId);

//   if (!post) {
//     return next(new AppError('post not found', 404));
//   }

//   if (title) {
//     post.title = title;
//   }

//   if (content) {
//     post.content = content;
//   }

//   if (req.file) {
//     const { secure_url } = await cloudinaryConfig().uploader.upload(
//       req.file.path,
//       {
//         folder: `${process.env.UPLOADS_FOLDER}/Posts/`,
//       }
//     );

//     post.attachedImage.secure_url = secure_url;
//   }

//   await post.save();
//   res.status(200).json({ message: 'post updated successfully', post });
// };

export const deletePostById = async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError('post not found', 404));
  }

  await cloudinaryConfig().api.delete_resources_by_prefix(
    post.attachedImage.public_id
  );

  // await cloudinaryConfig().api.delete_folder(
  //   `${process.env.UPLOADS_FOLDER}/Posts/`
  // );

  await Post.findByIdAndDelete(postId);

  res.status(200).json({ message: 'Post deleted successfully', post });
};

export const editPostById = async (req, res, next) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const organizationId = req.user._id;
  console.log(organizationId);

  // 1. Get post
  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // 2. Check ownership
  if (post.organizationId.toString() !== organizationId.toString()) {
    return next(new AppError('You are not authorized to edit this post', 403));
  }

  // 3. Update object
  post.title = title ?? post.title;
  post.content = content ?? post.content;

  // 4. Check if there's new image
  if (req.file) {
    // Delete old image from Cloudinary if exists
    if (post.attachedImage?.public_id) {
      await cloudinaryConfig().uploader.destroy(post.attachedImage.public_id);
    }

    // Upload new image
    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADS_FOLDER}/Posts/`,
      }
    );

    post.attachedImage = { secure_url, public_id };
  }

  // 5. Save post
  await post.save();

  res.status(200).json({ message: 'Post updated successfully', post });
};
