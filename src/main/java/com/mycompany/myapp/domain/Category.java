package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.CategoryStatus;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Category.
 */
@Entity
@Table(name = "category")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Category implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "welcome", nullable = false)
    private String welcome;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "date_added")
    private LocalDate dateAdded;

    @Column(name = "date_modified")
    private LocalDate dateModified;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CategoryStatus status;

    @OneToMany(mappedBy = "category")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "wishList", "category" }, allowSetters = true)
    private Set<Product> welcomes = new HashSet<>();

    @OneToMany(mappedBy = "category")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "welcomes", "welcomes", "category" }, allowSetters = true)
    private Set<Category> welcomes = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "welcomes", "welcomes", "category" }, allowSetters = true)
    private Category category;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Category id(Long id) {
        this.id = id;
        return this;
    }

    public String getWelcome() {
        return this.welcome;
    }

    public Category welcome(String welcome) {
        this.welcome = welcome;
        return this;
    }

    public void setWelcome(String welcome) {
        this.welcome = welcome;
    }

    public String getDescription() {
        return this.description;
    }

    public Category description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getSortOrder() {
        return this.sortOrder;
    }

    public Category sortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
        return this;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public LocalDate getDateAdded() {
        return this.dateAdded;
    }

    public Category dateAdded(LocalDate dateAdded) {
        this.dateAdded = dateAdded;
        return this;
    }

    public void setDateAdded(LocalDate dateAdded) {
        this.dateAdded = dateAdded;
    }

    public LocalDate getDateModified() {
        return this.dateModified;
    }

    public Category dateModified(LocalDate dateModified) {
        this.dateModified = dateModified;
        return this;
    }

    public void setDateModified(LocalDate dateModified) {
        this.dateModified = dateModified;
    }

    public CategoryStatus getStatus() {
        return this.status;
    }

    public Category status(CategoryStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(CategoryStatus status) {
        this.status = status;
    }

    public Set<Product> getWelcomes() {
        return this.welcomes;
    }

    public Category welcomes(Set<Product> products) {
        this.setWelcomes(products);
        return this;
    }

    public Category addWelcome(Product product) {
        this.welcomes.add(product);
        product.setCategory(this);
        return this;
    }

    public Category removeWelcome(Product product) {
        this.welcomes.remove(product);
        product.setCategory(null);
        return this;
    }

    public void setWelcomes(Set<Product> products) {
        if (this.welcomes != null) {
            this.welcomes.forEach(i -> i.setCategory(null));
        }
        if (products != null) {
            products.forEach(i -> i.setCategory(this));
        }
        this.welcomes = products;
    }

    public Set<Category> getWelcomes() {
        return this.welcomes;
    }

    public Category welcomes(Set<Category> categories) {
        this.setWelcomes(categories);
        return this;
    }

    public Category addWelcome(Category category) {
        this.welcomes.add(category);
        category.setCategory(this);
        return this;
    }

    public Category removeWelcome(Category category) {
        this.welcomes.remove(category);
        category.setCategory(null);
        return this;
    }

    public void setWelcomes(Set<Category> categories) {
        if (this.welcomes != null) {
            this.welcomes.forEach(i -> i.setCategory(null));
        }
        if (categories != null) {
            categories.forEach(i -> i.setCategory(this));
        }
        this.welcomes = categories;
    }

    public Category getCategory() {
        return this.category;
    }

    public Category category(Category category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Category)) {
            return false;
        }
        return id != null && id.equals(((Category) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Category{" +
            "id=" + getId() +
            ", welcome='" + getWelcome() + "'" +
            ", description='" + getDescription() + "'" +
            ", sortOrder=" + getSortOrder() +
            ", dateAdded='" + getDateAdded() + "'" +
            ", dateModified='" + getDateModified() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
