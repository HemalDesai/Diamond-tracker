import Link from "next/link";

const MonthButton = ({ month }) => {
  return (
    <Link href={`/${month.toLowerCase()}`} passHref>
      <button className="month-button">{month}</button>
    </Link>
  );
};

export default MonthButton;
