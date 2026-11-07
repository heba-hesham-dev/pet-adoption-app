// Shown after Send request
import { SuccessScreen } from '@/components/success-screen';

export default function RequestSentScreen() {
  return (
    <SuccessScreen
      headerTitle="Request Sent"
      title="Request sent!"
      message="The shelter will review your request and contact you within 24 hours to confirm your visit."
    />
  );
}
