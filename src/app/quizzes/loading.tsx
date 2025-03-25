import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function QuizzesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-4">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="flex flex-col items-center">
                <Skeleton className="h-8 w-[250px] mb-2" />
                <Skeleton className="h-4 w-[400px]" />
              </div>
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Search and Filter Section */}
            <div className="bg-background/80 shadow-sm border rounded-lg p-2 sm:p-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="h-full flex flex-col">
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>

                  <div className="flex justify-between mt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  <div className="mt-4">
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
