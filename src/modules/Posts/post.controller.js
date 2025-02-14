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
