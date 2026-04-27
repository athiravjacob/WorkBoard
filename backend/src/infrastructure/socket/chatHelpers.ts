import { ConversationModel } from '../database/models/ConversationModel';
import { Types } from 'mongoose';

/**
 * Data Integrity Check Helper
 * Ensures a user is a legitimate participant in a conversation before allowing chat actions.
 */
export const isParticipant = async (userId: string, conversationId: string): Promise<boolean> => {
  try {
    const conversation = await ConversationModel.findOne({
      _id: new Types.ObjectId(conversationId),
      participants: userId
    });

    return !!conversation;
  } catch (error) {
    console.error('Error checking chat participation:', error);
    return false;
  }
};
