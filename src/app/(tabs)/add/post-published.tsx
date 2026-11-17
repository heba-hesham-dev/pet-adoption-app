// Shown after Post for adoption
import { SuccessScreen } from '@/components/success-screen';

export default function PostPublishedScreen() {
  return (
    <SuccessScreen
      headerTitle="Post Sent"
      title="Your post was sent!"
      message="The shelter will review your pet's details and contact you within 24 hours by phone or email."
    />
  );
}
