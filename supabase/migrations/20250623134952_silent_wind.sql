-- GRCWalk Database Schema

-- Create risks table
CREATE TABLE IF NOT EXISTS risks (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    likelihood INT NOT NULL CHECK (likelihood BETWEEN 1 AND 5),
    impact INT NOT NULL CHECK (impact BETWEEN 1 AND 5),
    level ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_level (level)
);

-- Create controls table
CREATE TABLE IF NOT EXISTS controls (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('Preventive', 'Detective', 'Corrective', 'Directive') NOT NULL,
    status ENUM('Implemented', 'Partial', 'Planned', 'Not Implemented') NOT NULL,
    effectiveness INT NOT NULL CHECK (effectiveness BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_status (status)
);

-- Create risk_controls junction table
CREATE TABLE IF NOT EXISTS risk_controls (
    risk_id VARCHAR(36),
    control_id VARCHAR(36),
    PRIMARY KEY (risk_id, control_id),
    FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE,
    FOREIGN KEY (control_id) REFERENCES controls(id) ON DELETE CASCADE
);

-- Create risk_factors table
CREATE TABLE IF NOT EXISTS risk_factors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create risk_factor_risks junction table
CREATE TABLE IF NOT EXISTS risk_factor_risks (
    risk_factor_id VARCHAR(36),
    risk_id VARCHAR(36),
    PRIMARY KEY (risk_factor_id, risk_id),
    FOREIGN KEY (risk_factor_id) REFERENCES risk_factors(id) ON DELETE CASCADE,
    FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE
);

-- Create consequences table
CREATE TABLE IF NOT EXISTS consequences (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create consequence_risks junction table
CREATE TABLE IF NOT EXISTS consequence_risks (
    consequence_id VARCHAR(36),
    risk_id VARCHAR(36),
    PRIMARY KEY (consequence_id, risk_id),
    FOREIGN KEY (consequence_id) REFERENCES consequences(id) ON DELETE CASCADE,
    FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE
);

-- Create bowtie_relationships table
CREATE TABLE IF NOT EXISTS bowtie_relationships (
    id VARCHAR(36) PRIMARY KEY,
    risk_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_risk (risk_id)
);

-- Create bowtie_factors junction table
CREATE TABLE IF NOT EXISTS bowtie_factors (
    bowtie_id VARCHAR(36),
    factor_id VARCHAR(36),
    PRIMARY KEY (bowtie_id, factor_id),
    FOREIGN KEY (bowtie_id) REFERENCES bowtie_relationships(id) ON DELETE CASCADE,
    FOREIGN KEY (factor_id) REFERENCES risk_factors(id) ON DELETE CASCADE
);

-- Create bowtie_consequences junction table
CREATE TABLE IF NOT EXISTS bowtie_consequences (
    bowtie_id VARCHAR(36),
    consequence_id VARCHAR(36),
    PRIMARY KEY (bowtie_id, consequence_id),
    FOREIGN KEY (bowtie_id) REFERENCES bowtie_relationships(id) ON DELETE CASCADE,
    FOREIGN KEY (consequence_id) REFERENCES consequences(id) ON DELETE CASCADE
);

-- Create compliance_requirements table
CREATE TABLE IF NOT EXISTS compliance_requirements (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    framework VARCHAR(100) NOT NULL,
    status ENUM('Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Applicable') NOT NULL,
    due_date DATE NOT NULL,
    assignee VARCHAR(255) NOT NULL,
    evidence TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_framework (framework),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
);

-- Create compliance_controls junction table
CREATE TABLE IF NOT EXISTS compliance_controls (
    compliance_id VARCHAR(36),
    control_id VARCHAR(36),
    PRIMARY KEY (compliance_id, control_id),
    FOREIGN KEY (compliance_id) REFERENCES compliance_requirements(id) ON DELETE CASCADE,
    FOREIGN KEY (control_id) REFERENCES controls(id) ON DELETE CASCADE
);

-- Create action_plans table
CREATE TABLE IF NOT EXISTS action_plans (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Not Started', 'In Progress', 'Completed', 'Overdue', 'Cancelled') NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    due_date DATE NOT NULL,
    assignee VARCHAR(255) NOT NULL,
    progress INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date)
);

-- Create action_plan_risks junction table
CREATE TABLE IF NOT EXISTS action_plan_risks (
    action_plan_id VARCHAR(36),
    risk_id VARCHAR(36),
    PRIMARY KEY (action_plan_id, risk_id),
    FOREIGN KEY (action_plan_id) REFERENCES action_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE
);

-- Create action_plan_controls junction table
CREATE TABLE IF NOT EXISTS action_plan_controls (
    action_plan_id VARCHAR(36),
    control_id VARCHAR(36),
    PRIMARY KEY (action_plan_id, control_id),
    FOREIGN KEY (action_plan_id) REFERENCES action_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (control_id) REFERENCES controls(id) ON DELETE CASCADE
);

-- Create action_tasks table
CREATE TABLE IF NOT EXISTS action_tasks (
    id VARCHAR(36) PRIMARY KEY,
    action_plan_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    assignee VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (action_plan_id) REFERENCES action_plans(id) ON DELETE CASCADE
);

-- Create action_comments table
CREATE TABLE IF NOT EXISTS action_comments (
    id VARCHAR(36) PRIMARY KEY,
    action_plan_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (action_plan_id) REFERENCES action_plans(id) ON DELETE CASCADE
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status ENUM('Active', 'Inactive', 'Under Review', 'Terminated') NOT NULL,
    criticality ENUM('Critical', 'High', 'Medium', 'Low') NOT NULL,
    onboarding_date DATE NOT NULL,
    last_assessment_date DATE NOT NULL,
    next_assessment_date DATE NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    services JSON,
    risk_score INT DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
    risk_level ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_criticality (criticality)
);

-- Create vendor_risks junction table
CREATE TABLE IF NOT EXISTS vendor_risks (
    vendor_id VARCHAR(36),
    risk_id VARCHAR(36),
    PRIMARY KEY (vendor_id, risk_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE
);

-- Create vendor_controls junction table
CREATE TABLE IF NOT EXISTS vendor_controls (
    vendor_id VARCHAR(36),
    control_id VARCHAR(36),
    PRIMARY KEY (vendor_id, control_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    FOREIGN KEY (control_id) REFERENCES controls(id) ON DELETE CASCADE
);

-- Create audit_plans table
CREATE TABLE IF NOT EXISTS audit_plans (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    scope TEXT NOT NULL,
    objectives JSON,
    status ENUM('Planned', 'In Progress', 'Completed', 'Delayed', 'Cancelled') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auditor VARCHAR(255) NOT NULL,
    audit_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_audit_type (audit_type)
);

-- Create audit_plan_controls junction table
CREATE TABLE IF NOT EXISTS audit_plan_controls (
    audit_plan_id VARCHAR(36),
    control_id VARCHAR(36),
    PRIMARY KEY (audit_plan_id, control_id),
    FOREIGN KEY (audit_plan_id) REFERENCES audit_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (control_id) REFERENCES controls(id) ON DELETE CASCADE
);

-- Create audit_plan_risks junction table
CREATE TABLE IF NOT EXISTS audit_plan_risks (
    audit_plan_id VARCHAR(36),
    risk_id VARCHAR(36),
    PRIMARY KEY (audit_plan_id, risk_id),
    FOREIGN KEY (audit_plan_id) REFERENCES audit_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE
);

-- Create audit_checklist_items table
CREATE TABLE IF NOT EXISTS audit_checklist_items (
    id VARCHAR(36) PRIMARY KEY,
    audit_plan_id VARCHAR(36) NOT NULL,
    description TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    evidence TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_plan_id) REFERENCES audit_plans(id) ON DELETE CASCADE
);

-- Create audit_findings table
CREATE TABLE IF NOT EXISTS audit_findings (
    id VARCHAR(36) PRIMARY KEY,
    audit_plan_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    recommendation TEXT NOT NULL,
    responsible_party VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('Not Started', 'In Progress', 'Completed', 'Overdue', 'Cancelled') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_plan_id) REFERENCES audit_plans(id) ON DELETE CASCADE
);