import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function QuizzesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-4">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col space-y-4">
          {/* Header Section */}
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-36" />
                <Skeleton className="h-6 w-12 rounded-md" />
              </div>

              <Skeleton className="h-10 w-full sm:w-64 rounded-md" />
            </div>

            {/* Search and Filter Section */}
            <div className="bg-background/80 shadow-sm border rounded-lg p-3">
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <div className="relative flex-1 w-full">
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-40" />
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card
                key={item}
                className="h-full flex flex-col transition-all duration-300 overflow-hidden">
                <div className="p-4 space-y-3">
                  {/* Card Header */}
                  <div className="flex justify-between items-start pb-1">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-7 w-7 rounded-full" />
                    </div>
                  </div>

                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-5/6" />

                  {/* Card Content */}
                  <Skeleton className="h-px w-full my-3" />

                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                  </div>

                  <div className="flex justify-between pt-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2">
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
