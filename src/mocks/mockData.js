export const mockItem = {
  id: "123",
  title: "TI-84 Plus CE Graphing Calculator",
  price: 75.0,
  originalPrice: 120.0,
  condition: "Good",
  description:
    "TI-84 Plus CE graphing calculator in good condition. Perfect for calculus, statistics, and other math courses. Battery still holds a good charge. Some minor scratches on the screen but doesn't affect functionality. Comes with charging cable and protective case.",
  category: "Electronics",
  listedDate: "2023-09-15",
  location: "North Campus",
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ],
  seller: {
    id: "456",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.8,
    reviewCount: 23,
    joinedDate: "September 2022",
    responseRate: "95%",
    responseTime: "Within 2 hours",
  },
  reviews: [
    {
      id: "789",
      user: {
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      rating: 5,
      date: "2023-10-05",
      comment:
        "Calculator was in great condition as described. Alex was super helpful and met me on campus to deliver it. Would definitely buy from again!",
    },
    {
      id: "790",
      user: {
        name: "Taylor Wong",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      rating: 4,
      date: "2023-09-28",
      comment:
        "Good transaction overall. The calculator had a few more scratches than I expected, but works perfectly and was a fair price.",
    },
  ],
  relatedItems: [
    {
      id: "234",
      title: "Calculus Textbook - 8th Edition",
      price: 45.0,
      image: "/placeholder.svg?height=200&width=200",
      condition: "Like New",
    },
    {
      id: "235",
      title: "Scientific Calculator - TI-36X Pro",
      price: 15.0,
      image: "/placeholder.svg?height=200&width=200",
      condition: "Good",
    },
    {
      id: "236",
      title: "Statistics Study Guide",
      price: 10.0,
      image: "/placeholder.svg?height=200&width=200",
      condition: "Acceptable",
    },
  ],
};

export const categories = [
  { id: 1, name: "Textbooks" },
  { id: 2, name: "Electronics" },
  { id: 3, name: "Furniture" },
  { id: 4, name: "Clothing" },
  { id: 5, name: "School Supplies" },
  { id: 6, name: "Dorm Essentials" },
  { id: 7, name: "Sports Equipment" },
  { id: 8, name: "Other" },
];
