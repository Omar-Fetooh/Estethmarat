import { Organization, Post } from '../../../DB/models/index.js';
import { AppError, cloudinaryConfig } from '../../Utils/index.js';

export const createPost = async (req, res, next) => {
  const { title, content, organizationId } = req.body;

  const organization = await Organization.findById(organizationId);

  if (!organization) {
    return next(new AppError('organization is not found'));
  }

  let postObj = {
    title,
    content,
    organizationId,
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
    };
  }

  const post = await Post.create(postObj);

  res.status(201).json({ message: 'post created successfully', post });
};

export const getAllPosts = async (req, res, next) => {
  const posts = await Post.find();
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

export const updatePostById = async (req, res, next) => {
  const { postId } = req.params;

  const { title, content } = req.body;
  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError('post not found', 404));
  }

  if (title) {
    post.title = title;
  }

  if (content) {
    post.content = content;
  }

  if (req.file) {
    const { secure_url } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADS_FOLDER}/Posts/`,
      }
    );

    post.attachedImage.secure_url = secure_url;
  }

  await post.save();
  res.status(200).json({ message: 'post updated successfully', post });
};

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
