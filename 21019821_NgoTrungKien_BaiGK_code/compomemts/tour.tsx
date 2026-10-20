export const groupByCity = (tours: any[]) => {
  if (!tours || tours.length === 0) return [];


  const grouped = tours.reduce((acc: any, tour: any) => {
    const city = tour.city;
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(tour);
    return acc;
  }, {});

 
  const result = Object.keys(grouped).map(city => {
    const sortedData = grouped[city].sort((a: any, b: any) => {
      return new Date(a.departure).getTime() - new Date(b.departure).getTime();
    });
    return {
      title: city,
      data: sortedData
    };
  });


  result.sort((a, b) => a.title.localeCompare(b.title));

  return result;
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};


export const getSeatLabel = (seats: number) => {
  if (seats === 0) return "Hết chỗ";
  if (seats >= 1 && seats <= 3) return `Chỉ còn ${seats} chỗ`;
  return `Còn ${seats} chỗ`;
};