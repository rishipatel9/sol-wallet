"use client";

type AddressPageProps = {
  params: {
    address: string;
  };
};

const AddressPage = ({ params }: AddressPageProps) => {
  return (
    <div>
      <h1>Address: {params.address}</h1>
    </div>
  );
};

export default AddressPage;
