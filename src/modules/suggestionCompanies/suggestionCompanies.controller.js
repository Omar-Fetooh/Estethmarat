import { SuggestedCom } from '../../../DB/models/suggestedCompany.model.js';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { Post } from '../../../DB/models/post.model.js';
import { Company } from '../../../DB/models/company.model.js';
import { Investor } from '../../../DB/models/investor.model.js';
import { CharityOrganization } from '../../../DB/models/charityOrganization.model.js';
import { supportOrganization } from '../../../DB/models/supportOrganization.model.js';
import { AppError } from '../../Utils/AppError.js';
export const getRecomendations = errorHandler(async (req, res, next) => {
  const { userId } = req.query;

  if (!userId) return next(new AppError('Please provide user id!', 400));
  const { role } =
    (await Investor.findById(userId).select('role -_id')) ||
    (await Company.findById(userId).select('role -_id')) ||
    (await CharityOrganization.findById(userId).select('role -_id')) ||
    (await supportOrganization.findById(userId).select('role -_id'));
  if (role === 'investor') {
    const investor = await Investor.findById(userId);
    const recommendation_id = investor.recommendation_id;
    const results = await fetch(
      `https://modelapi-production-708b.up.railway.app/recommend/${recommendation_id}`
    );
    const data = await results.json();

    if (!(await SuggestedCom.findOne({ investor_id: recommendation_id }))) {
      await SuggestedCom.create(data);
    }
    const realSuggestedCompanies = await SuggestedCom.find();
    const suggestedCompanies = await Promise.all(
      realSuggestedCompanies
        .find((obj) => obj.investor_id === recommendation_id)
        .recommendations.map(
          async (id) => await Company.findOne({ recommendation_id: id })
        )
    );
    let newSuggested = [];
    for (let i = 0; i < suggestedCompanies.length; i++) {
      if (i === 9) break;
      newSuggested.push(suggestedCompanies[i]);
    }
    let posts = await Post.find({
      organizationType: 'CharityOrganization',
    }).populate({
      path: 'organizationId',
    });
    const charityPosts = posts.sort((a, b) => b.updatedAt - a.updatedAt);
    let newCharityPosts = [];
    for (let i = 0; i < charityPosts.length; i++) {
      if (i === 4) break;
      newCharityPosts.push(charityPosts[i]);
    }
    res.status(200).json({
      status: 'success',
      companyResults: newSuggested.length,
      postResults: newCharityPosts.length,
      data: {
        companies: newSuggested,
        newCharityPosts,
      },
    });
  }
  if (role === 'company') {
    const companies = await Company.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 9 },
    ]);
    const supportPosts = await Post.find({
      organizationType: 'SupportOrganization',
    }).populate('organizationId');
    const supPosts = supportPosts.sort((a, b) => b.updatedAt - a.updatedAt);
    let newSupportPosts = [];
    for (let i = 0; i < supPosts.length; i++) {
      if (i === 4) break;
      newSupportPosts.push(supPosts[i]);
    }

    const charityPosts = await Post.find({
      organizationType: 'CharityOrganization',
    }).populate('organizationId');
    const chaPosts = charityPosts.sort((a, b) => b.updatedAt - a.updatedAt);
    let newCharityPosts = [];
    for (let i = 0; i < chaPosts.length; i++) {
      if (i === 4) break;
      newCharityPosts.push(chaPosts[i]);
    }
    const investors = await Investor.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 9 },
    ]);
    res.status(200).json({
      status: 'success',
      companiesResults: companies.length,
      investorsResults: investors.length,
      charityPostResult: newCharityPosts.length,
      supportPostResult: newSupportPosts.length,
      data: {
        companies,
        investors,
        newCharityPosts,
        newSupportPosts,
      },
    });
  }
  if (role === 'charityOrganization' || role === 'supportOrganization') {
    const companies = await Company.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 9 },
    ]);
    const investors = await Investor.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 9 },
    ]);
    const posts = await Post.find({
      organizationType: 'CharityOrganization',
    }).populate('organizationId');
    const charityPosts = posts.sort((a, b) => b.updatedAt - a.updatedAt);
    let newCharityPosts = [];
    for (let i = 0; i < charityPosts.length; i++) {
      if (i === 4) break;
      newCharityPosts.push(charityPosts[i]);
    }
    res.status(200).json({
      status: 'success',
      companiesResults: companies.length,
      investorsResults: investors.length,
      postsResult: newCharityPosts.length,
      data: {
        companies,
        investors,
        newCharityPosts,
      },
    });
  }
});
