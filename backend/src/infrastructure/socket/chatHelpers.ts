import { ConversationModel } from '../database/models/ConversationModel';
import { Types } from 'mongoose';

/**
 * Data Integrity Check Helper
 * Ensures a user is a legitimate participant in a conversation before allowing chat actions.
 */
export const isParticipant = async (userId: string, conversationId: string): Promise<boolean> => {
  try {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(conversationId)) {
      return false;
    }

    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      participants: new Types.ObjectId(userId)
    });

    return !!conversation;
  } catch (error) {
    console.error('Error checking chat participation:', error);
    return false;
  }
};
