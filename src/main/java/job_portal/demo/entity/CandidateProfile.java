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
public class CandidateProfile {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@OneToOne
	@JoinColumn(name = "user_id")
	private User user;
	private String phone;
	@Column(columnDefinition = "TEXT")
	private String summary;
	private String avatarUrl; // đường dẫn ảnh đại diện sau khi upload
	private String attachmentUrl; // đường dẫn file đính kèm (bằng cấp, portfolio...)
}
