from datetime import date, datetime

from sqlalchemy import Date, DateTime, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from database.base import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    description: Mapped[str] = mapped_column(String(255), nullable=False)

    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    category: Mapped[str] = mapped_column(String(100), nullable=False)

    transaction_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="expense",
    )

    transaction_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )