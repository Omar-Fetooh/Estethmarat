import mongoose from 'mongoose';
const searchResultSchema = new mongoose.Schema({
  query: String,
  result: String,
  creaedAt: {
    type: Date,
    default: Date.now(),
  },
});

export const SearchResult = mongoose.model('SearchResult', searchResultSchema);
