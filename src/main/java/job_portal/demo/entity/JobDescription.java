package job_portal.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class JobDescription {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@OneToOne
	@JoinColumn(name = "job_listing_id")
	private JobListing jobListing;
	@Column(columnDefinition = "TEXT")
	private String responsibilities;
	@Column(columnDefinition = "TEXT")
	private String requirements;
	@Column(columnDefinition = "TEXT")
	private String benefits;
}
