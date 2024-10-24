package com.je3l.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import com.je3l.domain.Images;
import com.je3l.repository.ImagesRepository;
import java.util.stream.Stream;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;

/**
 * Spring Data Elasticsearch repository for the {@link Images} entity.
 */
public interface ImagesSearchRepository extends ElasticsearchRepository<Images, Long>, ImagesSearchRepositoryInternal {}

interface ImagesSearchRepositoryInternal {
    Stream<Images> search(String query);

    Stream<Images> search(Query query);

    @Async
    void index(Images entity);

    @Async
    void deleteFromIndexById(Long id);
}

class ImagesSearchRepositoryInternalImpl implements ImagesSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final ImagesRepository repository;

    ImagesSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, ImagesRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Stream<Images> search(String query) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery);
    }

    @Override
    public Stream<Images> search(Query query) {
        return elasticsearchTemplate.search(query, Images.class).map(SearchHit::getContent).stream();
    }

    @Override
    public void index(Images entity) {
        repository.findById(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), Images.class);
    }
}
