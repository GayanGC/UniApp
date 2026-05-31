import BoardingSearchPage from '@/components/boarding/BoardingSearchPage';

/**
 * Route: /accommodation/search
 *
 * This file makes the boarding search a proper Next.js App Router page.
 * All logic lives in the BoardingSearchPage client component.
 */
export const metadata = {
  title: 'Find Accommodation | Uni App',
  description: 'Search and filter available boarding rooms near your university.',
};

export default function AccommodationSearchPage() {
  return <BoardingSearchPage />;
}
