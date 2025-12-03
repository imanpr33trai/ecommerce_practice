

import Footer from '@/_components/Layout/Footer';
import Header from '@/_components/Layout/Header';
import MaxWidthWrapper from '@/_components/max-width-wrapper';
import CategoryFilters from './_components/CategoriesFilter';
import FinalCTASection from './_components/CTA';
import ExclusiveProductCard from './_components/ExclusiveProductCard';
import FeaturedCategoriesSection from './_components/FeaturedCategoriesSection';
import GreatValueCard from './_components/GreatValueCard';
import NewDealsCard from './_components/NewDealsCard';
import Sidebar from './_components/Sidebar';
// =================================================================================
// Header & Category Filters _components
// =================================================================================




export default function ModernLandingPage() {
  return (
    // The outer div now has a different background to distinguish sections
    <>
      <section className="bg-background dark:bg-gray-950 min-h-screen">
        {/* FIRST SECTION (Hero) */}
        <div className="bg-gray-100 dark:bg-zinc-900 p-4 md:p-6 h-full">
          <MaxWidthWrapper className="bg-background rounded-3xl p-4 md:p-6 group">
            <Header />
            <CategoryFilters />

            {/* Main Content Grid */}
            <div className="mt-4 grid grid-cols-12 gap-6">
              <NewDealsCard />
              <div className="col-span-12 md:col-span-7 lg:col-span-5 flex flex-col gap-6">
                <GreatValueCard />
                <ExclusiveProductCard />
              </div>
              <Sidebar />
            </div>
          </MaxWidthWrapper>
        </div>
      </section>
      {/* SECOND SECTION (Featured Categories) */}
      <FeaturedCategoriesSection />
      {/*<OurCommitmentSection />
      <TestimonialsSection />*/}
      <FinalCTASection />
      <Footer />
    </>
  );
}



// =================================================================================
// Main Grid Card _components
// =================================================================================





// =================================================================================
// Sidebar Widget _components
// =================================================================================

// =================================================================================
// Section 5: Featured Categories (Arrow Function Component)
// Inspired by the hero section's asymmetrical and visual-first design.
// =================================================================================

// =================================================================================
// Section 6: Our Commitment Section (Arrow Function Component)
// This section builds brand trust by highlighting core values.
// =================================================================================
// Make sure to import icons

// const OurCommitmentSection = () => {
//   // Data for the commitment cards, making it easy to manage
//   const commitments = [
//     {
//       icon: Palette,
//       title: 'Timeless Design',
//       description: 'We partner with world-class designers to create pieces that are both modern and timeless, ensuring they fit perfectly into your life for years to come.',
//       imageUrl: '/design-inspiration.jpg', // Assumes image in /public
//       href: '/about/design',
//     },
//     {
//       icon: Gem,
//       title: 'Uncompromising Quality',
//       description: 'From the solid wood frame to the hand-stitched fabric, every component is chosen for its durability and beauty. We build furniture to last.',
//       imageUrl: '/craftsmanship.jpg', // Assumes image in /public
//       href: '/about/quality',
//     },
//     {
//       icon: Leaf,
//       title: 'Sustainable Sourcing',
//       description: 'We are committed to protecting our planet by using responsibly harvested woods and recycled materials wherever possible, without sacrificing quality.',
//       imageUrl: '/sustainability.jpg', // Assumes image in /public
//       href: '/about/sustainability',
//     },
//   ];

//   // A reusable card component for this section
//   const CommitmentCard = ({ icon: Icon, title, description, imageUrl, href }: typeof commitments[0]) => (
//     <Link href={href} className="group block">
//       <Card className="flex h-full flex-col overflow-hidden rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl">
//         <div className="relative aspect-video w-full overflow-hidden">
//           <Image
//             src={imageUrl}
//             alt={title}
//             layout="fill"
//             objectFit="cover"
//             className="transition-transform duration-500 ease-in-out group-hover:scale-105"
//           />
//         </div>
//         <div className="flex flex-1 flex-col p-6">
//           <div className="mb-4 flex items-center gap-3">
//             <Icon className="h-6 w-6 text-primary" />
//             <h3 className="text-xl font-bold">{title}</h3>
//           </div>
//           <p className="flex-1 text-muted-foreground">{description}</p>
//           <div className="mt-4 flex items-center font-semibold text-primary">
//             Learn More
//             <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
//           </div>
//         </div>
//       </Card>
//     </Link>
//   );

//   return (
//     <section className="bg-background dark:bg-gray-950 py-16">
//       <MaxWidthWrapper>
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold tracking-tight">Built on a Foundation of Trust</h2>
//           <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
//             We're not just selling furniture. We're offering a commitment to exceptional design, quality, and responsible craftsmanship.
//           </p>
//         </div>

//         {/* Responsive Grid for the commitment cards */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {commitments.map((commitment) => (
//             <CommitmentCard key={commitment.title} {...commitment} />
//           ))}
//         </div>
//       </MaxWidthWrapper>
//     </section>
//   );
// };
// =================================================================================
// Section 7: Customer Testimonials Section (Arrow Function Component)
// This section provides social proof and builds confidence.
// =================================================================================

// const TestimonialsSection = () => {
//   // Data for the testimonials. Easy to update, add, or remove.
//   const testimonials = [
//     {
//       quote: "The centerpiece of our living room. The quality is exceptional, and it's even more comfortable than it looks. We couldn't be happier with our purchase.",
//       name: 'Sarah L.',
//       location: 'New York, NY',
//       rating: 5,
//       imageUrl: '/testimonial-living-room.jpg', // Assumes image in /public
//     },
//     {
//       quote: "I was looking for a statement piece, and this chair is it. The design is a work of art, and the craftsmanship is evident in every detail. It completely transformed my reading corner.",
//       name: 'Michael B.',
//       location: 'Chicago, IL',
//       rating: 5,
//       imageUrl: '/testimonial-reading-corner.jpg', // Assumes image in /public
//     },
//     {
//       quote: "Our new dining set is not only beautiful but also incredibly sturdy. It's become the heart of our home for family meals and game nights. The sustainable wood was a huge plus for us.",
//       name: 'Emily & David R.',
//       location: 'Austin, TX',
//       rating: 5,
//       imageUrl: '/testimonial-dining-room.jpg', // Assumes image in /public
//     },
//   ];

//   // A reusable card component for this section
//   const TestimonialCard = ({ quote, name, location, rating, imageUrl, className }: typeof testimonials[0] & { className?: string }) => (
//     <Card className={`group flex flex-col justify-between overflow-hidden rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl ${className}`}>
//       <div className="p-6">
//         <div className="flex items-center gap-0.5">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
//           ))}
//         </div>
//         <blockquote className="mt-4 text-lg italic text-foreground">"{quote}"</blockquote>
//       </div>
//       <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 p-6">
//         <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
//           <Image
//             src={imageUrl}
//             alt={`Testimonial from ${name}`}
//             layout="fill"
//             objectFit="cover"
//             className="transition-transform duration-500 ease-in-out group-hover:scale-105"
//           />
//         </div>
//         <footer className="mt-4 text-right">
//           <p className="font-bold">{name}</p>
//           <p className="text-sm text-muted-foreground">{location}</p>
//         </footer>
//       </div>
//     </Card>
//   );

//   return (
//     <section className="bg-gray-50 dark:bg-black py-16">
//       <MaxWidthWrapper>
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold tracking-tight">Loved by Homes Everywhere</h2>
//           <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
//             See what our customers are saying about their new favorite furniture pieces.
//           </p>
//         </div>

//         {/* Staggered/Masonry Grid for testimonials */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           <div className="flex flex-col gap-6">
//             <TestimonialCard {...testimonials[0]} />
//           </div>
//           <div className="flex flex-col gap-6 lg:translate-y-12">
//             <TestimonialCard {...testimonials[1]} />
//           </div>
//           <div className="flex flex-col gap-6">
//             <TestimonialCard {...testimonials[2]} />
//           </div>
//         </div>
//       </MaxWidthWrapper>
//     </section>
//   );
// };
// =================================================================================
// Section 8: Final Call-to-Action (CTA) Section
// This provides a final, powerful prompt to convert interest into action.
// =================================================================================


// =================================================================================
// Section 9: The Footer
// The standard, utility-focused footer for global navigation and information.
// =================================================================================

// Import social icons


// =================================================================================
// Main Page Component
// =================================================================================