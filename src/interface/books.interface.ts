import mongoose, { Document } from 'mongoose'

export interface IBook extends Document {
  title: string
  author: mongoose.Schema.Types.ObjectId
  category: mongoose.Schema.Types.ObjectId
  ISBN: string
  description: string
  price: number
}
