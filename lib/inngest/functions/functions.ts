// Register all functions for inngest
import { inngest} from "../client";
import scheduledNewsletterFunction from "../functions/scheduled-newsletter";

export const functions = [scheduledNewsletterFunction];