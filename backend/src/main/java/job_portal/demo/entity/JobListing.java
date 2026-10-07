package job_portal.demo.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class JobListing {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String title;
	@ManyToOne
	@JoinColumn(name = "company_id")
	private Company company;
	@ManyToOne
	@JoinColumn(name = "recruiter_id")
	private User recruiter;
	@ManyToOne
	@JoinColumn(name = "job_type_id")
	private JobType jobType;
	@ManyToOne
	@JoinColumn(name = "industry_id")
	private Industry industry;
	@ManyToOne
	@JoinColumn(name = "location_id")
	private CompanyLocation location;
	private BigDecimal salaryMin;
	private BigDecimal salaryMax;
	private LocalDate deadline;
	@Enumerated(EnumType.STRING)
	private JobStatus status = JobStatus.OPEN;
	private LocalDateTime createdAt = LocalDateTime.now();
}
