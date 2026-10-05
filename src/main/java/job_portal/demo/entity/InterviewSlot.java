package job_portal.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
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
public class InterviewSlot {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "job_listing_id")
	private JobListing jobListing;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private String meetingLink;
	@ManyToOne
	@JoinColumn(name = "job_application_id")
	private JobApplication jobApplication; // null = còn trống, có giá trị = đã được đặt
}