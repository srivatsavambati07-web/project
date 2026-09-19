"""
AccessGov - PostgreSQL Database Schema & Connection
"""

import os
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/accessgov")

Base = declarative_base()

class ScanRecord(Base):
    __tablename__ = "scans"

    id = Column(String(64), primary_key=True, index=True)
    url = Column(String(512), nullable=False)
    portal_name = Column(String(256), nullable=False)
    department = Column(String(256), nullable=True)
    scanned_at = Column(DateTime, default=datetime.utcnow)
    accessgov_score = Column(Integer, default=0)
    gigw_score = Column(Integer, default=0)
    total_issues = Column(Integer, default=0)
    critical_blockers = Column(Integer, default=0)
    stats_json = Column(JSON, nullable=True)
    citizen_summary = Column(Text, nullable=True)
    department_summary = Column(Text, nullable=True)

    violations = relationship("ViolationRecord", back_populates="scan", cascade="all, delete-orphan")

class ViolationRecord(Base):
    __tablename__ = "violations"

    id = Column(String(64), primary_key=True, index=True)
    scan_id = Column(String(64), ForeignKey("scans.id"), nullable=False)
    rule_id = Column(String(128), nullable=False)
    title = Column(String(256), nullable=False)
    priority = Column(String(32), nullable=False)
    confidence = Column(String(32), default="auto_verified")
    citizen_stage = Column(String(64), nullable=False)
    affected_citizen = Column(String(256), nullable=False)
    government_task = Column(String(256), nullable=False)
    impact_description = Column(Text, nullable=False)
    wcag_criterion = Column(String(64), nullable=True)
    gigw_clause = Column(String(64), nullable=True)
    target_selector = Column(String(512), nullable=True)
    html_snippet = Column(Text, nullable=True)
    plain_language_explanation = Column(Text, nullable=True)

    scan = relationship("ScanRecord", back_populates="violations")

# Database session dependency
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"PostgreSQL connection notice (running offline/in-memory fallback): {e}")
