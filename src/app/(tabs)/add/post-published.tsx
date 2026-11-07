// Shown after Post for adoption
import { SuccessScreen } from '@/components/success-screen';

export default function PostPublishedScreen() {
  return (
    <SuccessScreen
      headerTitle="Post Published"
      title="Your post is posted!"
      message={'Your post is now live.\nPeople interested in adopting will contact you using the details you shared.'}
    />
  );
}
