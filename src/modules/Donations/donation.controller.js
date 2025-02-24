import { Donation, Investor, Organization } from '../../../DB/models/index.js';
import { AppError } from '../../Utils/AppError.js';

export const addDonation = async (req, res, next) => {
  const { organizationId, investorId, amount } = req.body;

  const organization = await Organization.findById(organizationId);
  if (!organization) return next(new AppError('organization not found', 404));

  const investor = await Investor.findById(investorId);
  if (!investor) return next(new AppError('investor not found', 404));

  const donation = await Donation.create({
    organizationId,
    investorId,
    amount,
  });

  res.status(201).json({
    message: 'Donation added successfully',
    donation,
  });
};

export const getAllDonations = async (req, res, next) => {
  const donations = await Donation.find().populate('organizationId investorId');

  res
    .status(200)
    .json({ message: 'Donations retrieved successfully', donations });
};

export const getDonationById = async (req, res, next) => {
  const { donationId } = req.params;

  const donation = await Donation.findById(donationId).populate(
    'organizationId investorId'
  );

  if (!donation) return next(new AppError('Donation not found', 404));

  res
    .status(200)
    .json({ message: 'Donation retrieved successfully', donation });
};

export const updateDonationById = async (req, res, next) => {
  const { donationId } = req.params;
  const { organizationId, investorId, amount } = req.body;

  const donation = await Donation.findById(donationId);

  if (!donation) return next(new AppError('Donation not found', 404));

  if (organizationId) donation.organizationId = organizationId; // Should add validations using JOI
  if (investorId) donation.investorId = investorId;
  if (amount) donation.amount = amount;

  await donation.save();

  res.status(200).json({ message: 'Donation updated successfully', donation });
};

export const deleteDonationById = async (req, res, next) => {
  const { donationId } = req.params;

  const donation = await Donation.findById(donationId);
  if (!donation) return next(new AppError('Donation not found', 404));

  await donation.deleteOne();

  res.status(200).json({ message: 'Donation deleted successfully', donation });
};
