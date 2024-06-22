import axios, { AxiosResponse } from "axios";
import { useEffect, useMemo, useState } from "react";

interface User {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  hair: {
    color: string;
    type: string;
  };
  address: {
    postalCode: string;
  };
  company: {
    department: string;
  };
}

const calculateAgeRange = (ages: number[]): string => {
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);
  return `${minAge}-${maxAge}`;
};

export default function Home() {
  const [dataList, setDataList] = useState<any>();

  const dataUsers = useMemo(() => {
    if (dataList == null) return [];

    return dataList?.users;
  }, [dataList]);

  const groupData = useMemo(() => {
    if (dataUsers == null || dataUsers?.length === 0) return;

    const departmentData: any = {};

    dataUsers.forEach((user: User) => {
      const { department } = user.company;
      const { gender, age, hair, firstName, lastName, address } = user;

      if (!departmentData[department]) {
        departmentData[department] = {
          male: 0,
          female: 0,
          ageRange: "",
          hair: {},
          addressUser: {},
        };
      }

      const dep = departmentData[department];

      // Gender count
      if (gender === "male") {
        dep.male += 1;
      } else if (gender === "female") {
        dep.female += 1;
      }

      // Age range
      const ages = dataUsers
        .filter((user: User) => user.company.department === department)
        .map((user: User) => user.age);
      dep.ageRange = calculateAgeRange(ages);

      // Hair color count
      if (!dep.hair[hair.color]) {
        dep.hair[hair.color] = 0;
      }
      dep.hair[hair.color] += 1;

      // Address summary
      const fullName = `${firstName}${lastName}`;
      dep.addressUser[fullName] = address.postalCode;
    });

    return departmentData;
  }, [dataUsers]);

  const handleFetchData = async () => {
    try {
      const res = await axios.get("https://dummyjson.com/users");

      setDataList(res.data);
    } catch (error) {
      // Handle the error
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <div className="p-24">
      <div className="p-5 rounded-md bg-neutral-100 h-[500px] overflow-y-auto">
        <pre>{JSON.stringify(groupData, null, 2)}</pre>
      </div>
    </div>
  );
}
